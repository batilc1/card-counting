goog.provide('app.base.Component');
goog.require('app.base.EventTarget');



/**
 * @constructor
 * @extends {app.base.EventTarget}
 */
app.base.Component = function() {
    goog.base(this);
};
goog.inherits(app.base.Component, app.base.EventTarget);


/**
 * The name of the element in DOM and should be overriden by the implementer
 * @protected
 */
app.base.Component.prototype.name = 'mf-default';


/**
 * ViewModel that will represent the element in DOM. Should be overriden by the implementer
 * @protected
 */
app.base.Component.prototype.viewModel = app.base.ViewModel;


/**
 * The template (captured in a string). It should be overriden by the implementer's template.
 * @protected
 */
app.base.Component.prototype.template = '<mf-default></mf-default>';