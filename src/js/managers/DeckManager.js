goog.provide('app.managers.DeckManager');
goog.require('app.base.Manager');
goog.require('app.models.Deck');


/**
 * @constructor
 * @extends {app.base.Manager}
 */
app.managers.DeckManager = function(){
	goog.base(this);

	this.deck = new app.models.Deck();
};
goog.inherits(app.managers.DeckManager, app.base.Manager);
goog.addSingletonGetter(app.managers.DeckManager);


app.managers.DeckManager.prototype.shuffle = function(){
	this.deck.cards = _.shuffle(this.deck.cards);
};


app.managers.DeckManager.prototype.getCard = function(){
	if(!this.deck.cards.length) return -1;

	return this.deck.cards.pop();
};


/**
 * 
 * @param  {Array<app.models.Card>|app.models.Card} cards [description]
 */
app.managers.DeckManager.prototype.collectCard = function(cards){
	if(Object.prototype.toString.call(cards) == '[object Array]')
		this.deck.cards.concat(cards);
	else
		this.deck.cards.push(cards);
};