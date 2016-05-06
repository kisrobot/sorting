!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t("object"==typeof exports?require("jquery"):jQuery)}(function(t){"use strict";function o(i,e){this.$element=t(i),this.options=t.extend({},o.DEFAULTS,t.isPlainObject(e)&&e),this.$source=null,this.ascending=!1,this.orderType=0,this.startY=0,this.init()}var i=window.location,e="qor.sorting",n="enable."+e,r="disable."+e,s="change."+e,a="mousedown."+e,d="mouseup."+e,u="dragstart."+e,p="dragend."+e,h="dragover."+e,f="drop."+e,c="qor-sorting",l="qor-sorting__highlight",g="qor-sorting__hover",v="tbody > tr";return o.prototype={constructor:o,init:function(){var i,e=this.options,n=this.$element,r=n.find(v),s=0,a=0,d=0;t("body").addClass(c),n.find("tbody .qor-table__actions").append(o.TEMPLATE),r.each(function(o){var n=t(this).find(e.input).data("position");o>0&&(n>i?a++:a--),i=n,d=o}),a===d?s=1:-a===d&&(s=-1),this.$rows=r,this.orderType=s,this.bind()},bind:function(){var o=this.options;this.$element.on(s,o.input,t.proxy(this.change,this)).on(a,o.toggle,t.proxy(this.mousedown,this)).on(d,t.proxy(this.mouseup,this)).on(u,v,t.proxy(this.dragstart,this)).on(p,v,t.proxy(this.dragend,this)).on(h,v,t.proxy(this.dragover,this)).on(f,v,t.proxy(this.drop,this))},unbind:function(){this.$element.off(s,this.change).off(a,this.mousedown)},change:function(o){var i,e=this.options,n=this.orderType,r=this.$rows,s=t(o.currentTarget),a=s.closest("tr"),d=a.parent(),u=s.data(),p=u.position,h=parseInt(s.val(),10),f=h>p;r.each(function(){var o=t(this),r=o.find(e.input),s=r.data("position");s===h&&(i=o,f?1===n?i.after(a):-1===n&&i.before(a):1===n?i.before(a):-1===n&&i.after(a)),f?s>p&&h>=s&&r.data("position",--s).val(s):p>s&&s>=h&&r.data("position",++s).val(s)}),s.data("position",h),i||(f?1===n?d.append(a):-1===n&&d.prepend(a):1===n?d.prepend(a):-1===n&&d.append(a)),this.sort(a,{url:u.sortingUrl,from:p,to:h})},mousedown:function(o){this.startY=o.pageY,t(o.currentTarget).closest("tr").prop("draggable",!0)},mouseup:function(){this.$element.find(v).prop("draggable",!1)},dragend:function(){t(v).removeClass(g),this.$element.find(v).prop("draggable",!1)},dragstart:function(o){var i=o.originalEvent,e=t(o.currentTarget);e.prop("draggable")&&i.dataTransfer&&(i.dataTransfer.effectAllowed="move",this.$source=e)},dragover:function(o){var i=this.$source;t(v).removeClass(g),t(o.currentTarget).prev("tr").addClass(g),i&&o.currentTarget!==this.$source[0]&&o.preventDefault()},drop:function(o){var i,e,n,r,s,a,d=this.options,u=this.orderType,p=o.pageY>this.startY,h=this.$source;t(v).removeClass(g),h&&o.currentTarget!==this.$source[0]&&(o.preventDefault(),e=t(o.currentTarget),i=h.find(d.input),n=i.data(),r=n.position,s=e.find(d.input).data("position"),a=s>r,this.$element.find(v).each(function(){var o=t(this).find(d.input),i=o.data("position");a?i>r&&s>=i&&o.data("position",--i).val(i):r>i&&i>=s&&o.data("position",++i).val(i)}),i.data("position",s).val(s),a?1===u?e.after(h):-1===u?e.before(h):p?e.after(h):e.before(h):1===u?e.before(h):-1===u?e.after(h):p?e.before(h):e.after(h),this.sort(h,{url:n.sortingUrl,from:r,to:s}))},sort:function(o,e){var n=this.options;e.url&&(this.highlight(o),t.ajax(e.url,{method:"post",data:{from:e.from,to:e.to},success:function(t,i,e){200===e.status&&o.find(n.input).data("position",t).val(t)},error:function(t,o,e){422===t.status?window.confirm(t.responseText)&&i.reload():window.confirm([o,e].join(": "))&&i.reload()}}))},highlight:function(t){t.addClass(l),setTimeout(function(){t.removeClass(l)},2e3)},destroy:function(){this.unbind(),this.$element.removeData(e)}},o.DEFAULTS={toggle:!1,input:!1},o.TEMPLATE='<a class="qor-sorting__toggle"><i class="material-icons">swap_vert</i></a>',o.plugin=function(i){return this.each(function(){var n,r=t(this),s=r.data(e);if(!s){if(/destroy/.test(i))return;r.data(e,s=new o(this,i))}"string"==typeof i&&t.isFunction(n=s[i])&&n.apply(s)})},t(function(){if(/sorting\=true/.test(i.search)){var e=".qor-js-table",s={toggle:".qor-sorting__toggle",input:".qor-sorting__position"};t(document).on(r,function(i){o.plugin.call(t(e,i.target),"destroy")}).on(n,function(i){o.plugin.call(t(e,i.target),s)}).trigger("disable.qor.slideout").triggerHandler(n)}}),o});
//# sourceMappingURL=sorting.js.map
