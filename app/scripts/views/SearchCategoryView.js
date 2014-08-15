define(['backbone', 'SearchElementView'], function (Backbone, SearchElementView) {

    var SearchCategoryView = Backbone.View.extend({

        tagName: 'li',
        className: 'search-element category',

        initialize: function (attrs, options) {
            this.expanded = false;
            this.searchElements = options.searchElements;
            this.parent = options.parent;
            this.searchView = options.searchView; 
        },

        template: _.template($('#search-category-template').html()),

        events: { 'click': 'toggle' },

        render: function () {
            var $childContainer;

            this.$el.html(this.template(this.model));
            $childContainer = this.$el.find('ul').eq(0);

            //Hide container of children elements
            $childContainer.hide();

            _.each(this.model.descendants, function (val, key) {
                var view = new SearchCategoryView({
                    model: val
                },
                {
                    parent: this,
                    searchElements: this.searchElements,
                    searchView: this.searchView
                });

                $childContainer.append(view.render().$el);
            }.bind(this));

            _.each(this.model.elements, function (element) {
                var view = new SearchElementView({
                    model: element
                },
                {
                    parent: this,
                    searchElements: this.searchElements,
                    searchView: this.searchView
                });

                this.searchElements.push(view);

                $childContainer.append(view.render().$el);
            }.bind(this));

            return this;
        },

        toggle: function (event, open) {
            if( typeof open === 'boolean' ){
                this.expanded = open;  
            }
            else {
                this.expanded = !this.expanded;  
            }            

            if (this.expanded) {
                this.$el.addClass('expanded');
                this.$el.find('ul').eq(0).show();
            }
            else {
                this.$el.removeClass('expanded');
                this.$el.find('ul').eq(0).hide();
            }            

            //Stop event propagation so the parent elements won't get it
            event && event.preventDefault();
            return false;
        },

        show: function(){
            this.$el.show();
            this.$el.addClass('expanded');
            this.$el.find('ul').eq(0).show();
            this.expanded = true;
        }
    });

    return SearchCategoryView;
});