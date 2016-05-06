package sorting

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"strings"

	"github.com/jinzhu/gorm"
	"github.com/qor/admin"
	"github.com/qor/qor"
	"github.com/qor/qor/resource"
	"github.com/qor/qor/utils"
	"github.com/qor/roles"
)

type SortableCollection struct {
	PrimaryField string
	PrimaryKeys  []string
}

func (sortableCollection *SortableCollection) Scan(value interface{}) error {
	switch values := value.(type) {
	case []string:
		sortableCollection.PrimaryKeys = values
	case []byte:
		return json.Unmarshal(values, sortableCollection)
	default:
		return errors.New("unsupported driver -> Scan pair for MediaLibrary")
	}

	return nil
}

func (sortableCollection SortableCollection) Value() (driver.Value, error) {
	results, err := json.Marshal(sortableCollection)
	return string(results), err
}

func (sortableCollection SortableCollection) Sort(results interface{}) error {
	values := reflect.ValueOf(results)
	if values.Kind() != reflect.Ptr || reflect.Indirect(values).Kind() != reflect.Slice {
		return errors.New("invalid type")
	}

	scope := gorm.Scope{Value: results}
	if primaryField := scope.PrimaryField(); primaryField != nil {
		var (
			primaryFieldName = primaryField.Name
			indirectValues   = values.Elem()
			sliceType        = indirectValues.Type()
			slice            = reflect.MakeSlice(sliceType, 0, 0)
			slicePtr         = reflect.New(sliceType)
			orderedMap       = map[int]bool{}
		)

		slicePtr.Elem().Set(slice)
		for _, primaryKey := range sortableCollection.PrimaryKeys {
			for i := 0; i < indirectValues.Len(); i++ {
				value := indirectValues.Index(i)
				field := value.FieldByName(primaryFieldName)
				if fmt.Sprint(field.Interface()) == primaryKey {
					slicePtr.Elem().Set(reflect.Append(slicePtr.Elem(), value))
					orderedMap[i] = true
				}
			}
		}

		for i := 0; i < indirectValues.Len(); i++ {
			if _, ok := orderedMap[i]; !ok {
				slicePtr.Elem().Set(reflect.Append(slicePtr.Elem(), indirectValues.Index(i)))
			}
		}

		values.Elem().Set(slicePtr.Elem())
	}

	return nil
}

func (sortableCollection *SortableCollection) ConfigureQorMeta(metaor resource.Metaor) {
	if meta, ok := metaor.(*admin.Meta); ok {
		var (
			name         = strings.TrimSuffix(meta.GetName(), "Sorter")
			res          = meta.GetBaseResource().(*admin.Resource)
			sortableMeta = res.GetMeta(name)
		)

		res.UseTheme("sortable_collection")

		if sortableMeta != nil && (sortableMeta.Type == "select_many" || sortableMeta.Type == "collection_edit") {
			sortableMeta.Type = "sortable_" + sortableMeta.Type

			setter := sortableMeta.GetSetter()
			sortableMeta.SetSetter(func(record interface{}, metaValue *resource.MetaValue, context *qor.Context) {
				primaryKeys := utils.ToArray(metaValue.Value)
				reflectValue := reflect.Indirect(reflect.ValueOf(record))
				reflectValue.FieldByName(meta.GetName()).Set(reflect.ValueOf(primaryKeys))
				setter(record, metaValue, context)
			})

			valuer := sortableMeta.GetValuer()
			sortableMeta.SetValuer(func(record interface{}, context *qor.Context) interface{} {
				results := valuer(record, context)
				reflectValue := reflect.Indirect(reflect.ValueOf(record))
				reflectValue.FieldByName(meta.GetName()).Interface().(SortableCollection).Sort(results)
				return results
			})

			meta.SetSetter(func(interface{}, *resource.MetaValue, *qor.Context) {})
			meta.SetPermission(roles.Deny(roles.CRUD, roles.Anyone))
		}
	}
}
