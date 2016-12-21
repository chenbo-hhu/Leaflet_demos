var AppName = {
	Models:{},
	Views: {},
	Collections :{},
	Controllers :{}
};

AppName.Models.Person = Backbone.Model.extend({
	urlRoot: "/persons"
});

AppName.Collections.Library = Backbone.Collections.extend({
	model: AppName.Models.Book
});

AppName.Views.Modals.AcceptDecline = Backbone.View.extend({
	el: ".modal-accept",

	events:{
		"ajax:success .link-accept": "accpetSuccess",
		"ajax:error .link-accept" : "acceptError"
	},

	accpetSuccess :function(evt, response){
		this.$el.modal("hide");
		alert('Cool! Thanks');
	},

	acceptError :function(evt, response){
		var $modalContent = this.$el.find('.panel-modal');

		$modalContent.append("Something was wrong!");
	}
})

AppName.Controllers.Person = {};
AppName.Controllers.Person.show = function(id){
	var aMa = new AppName.Models.Person({id: id});

	aMa.updateAge(25);

	aMa.fetch().done(function(){
		var view = new AppName.Views.Show({model: aMa});
	});
}

var Workspace = Backbone.Router.extend({
	route: {
		"*"	:"wholeApp",
		"users/:id" : "usersShow",
		"users/:id/orders/":"ordersIndex"
	}，

	wholeApp	:AppName.Controller.Application.default,
	usersShow	:AppName.Controller.Users.show,
	ordersIndex	:AppName.Controller.Orders.index
});

new Workspace();
Backbone.history.start({pushState: true});

var AppView = Backbone.View.extend({
	render: function(){
		$('main').append('<h1>一级标题</h1>');
	}
});

var appVier = new AppView(model: doc);
appView.render();

var AppView = Backbone.View.extend({
	initialize: function(){
		this.render();
	}.
	render: function(){
		$('main').append('<h1>一级标题</h1>');
	}
});

var appView = new AppView();

var AppView = Backbone.View.extend({
	el: $('main'),
	render: function(){
		this.$el.append('<h1>一级标题</h1>');
	}
});


var Document = Backbone.View.extend({
	tagName: "li",
	className: "document",
	render: function(){

	}
});

var AppView = Backbone.View.extend({
	template: _.template("<h3>Hellp <%= who %><h3>"),
});

var AppView = Backbone.View.extend({
	el: $('#container'),
	template: _.template("<h3>Hello <%= who %><h3>"),
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html(this.template({who: 'world!'}));
	}
})

window.templates = {};

var $source = $('script[type="text/template"]');

$sources.each(function(index, el){
	var $el = $(el);
	templates[$el.data('name')] = _.template($el.html());
})

var Document = Backbone.View.extend({
	events: {
		"click .icon": "open", 
		"click .button.edit": "openEditDialog",
		"click .button.delete": "destroy"
	}
});


var Document = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, "change", this.render);
	},
	updateView: function(){
		view.remove();
		view.render();
	}
	render: function(){
		this.$el.html(this.template());
		this.child = new Child();
		this.child.appendTo($.('.container-placeholder').render());
	}
});


var EventChannel = _.extend({}, Backbone.Events);

var channel = $.extend({}, Backbone.Events);
channel.on('remove-node', function(msg){
	// 
});

channel.trigger('remove-node', msg);


channel.on('add-node', function(node, callback){
	callback();
});

channel.trigger('add-node', {
	label: 'I am a new node',
	color: 'black'
}, function(){
	console.log('I am a callback');
})
;

Router = Backbone.Router.extend({
	route: {
		'': "phonesIndex", 
	},
	phonesIndex: function(){
		new PhonesIndexView({
			el: "section#main";
		})
	}
})

var AppRouter = Backbone.Router.extend({
	routes: {
		"*actions": "defaultRoute"
	}
});

var app_router = new AppRouter();

app_router.on('route:defaultRoute', function(actions){
	console.log(actions);
})


var myrouter = Backbone.Router.extend({
	routes: {
		"help": "help",
		"search/:query": "search"
	},

	help: function(){

	},

	search: function(query){

	}
});


routes: {
	"help/:page": "help", 
	"download/*path": "download",
	"folder/:name": "openFolder",
	"folder/:name-:mode": "openFolder"
}

route.on("route:help", function(page){
	...
});

App = new Router();

$(document).ready(function(){
	Backbone.history.start({
		pushState: true
	})
})

Backbone.history.start({
	pushState: true,
	root："/public/search"
})

var User = Backbone.Model.extend({
	defaults: {
		name: '',
		email: ''
	}
});

var user = new User();

var user = new User({
	id:1,
	name: 'name',
	email: 'name@email.com'
});

var Music = Backbone.Model.extend({
	idAttribute: 'id'
});

var user = new User({name: "name", age:24});
var age = user.get("age");
var name = user.get("name");

var User = Backbone.Model.extend({
	buy: function(newCarsName){
		this.set({car: newCarsName});
	}
});

var user = new User({name: 'BMW', model:'i8',type:'car'});

user.buy('Porsche');

var car = user.get("car");

var user = new User({name: 'BMW', model:'i8'});

user.on("change:name", function(model){
	var name = model.get("name");
	console.log("Changed my car's name to " + name);
});

user.set({name: 'Porsche'});

var User = Backbone.Model.extend({
	urlRoot: '/user'
});

var user = new User({id: 1});
user.fetch({
	success: function(user){
			console.log(user.toJSON());
	}
})

var User = Backbone.Model.extend({
	urlRoot: '/user'
});

var user = new User();
var userDetails = {
	name: 'name',
	email: 'name@email.com'
};

user.save(userDetails, {
	success: function(user){
		console.log(user.toJSON());
	}
})

var user = new User({
	id: 1,
	name: 'name',
	email: 'name@email.com'
});

user.destroy({
	success: function(){
		console.log('Destoryed');
	}
})

var Song = Backbone.Model.extend({});

var Album = Backbone.Collection.extend({
	model:Song
});

var song1 = new Song({id:1, name:'歌名1', artist:"张三"});
var song2 = new Song({id:2, name:'歌名2', artist:"李四"});
var myAlbum = new Album([song1, song2]);

var song3 = new Music({id:3, name: "歌名3", artist:"赵五	"});
myAlbum.add(song3);

myAlbum.remove(3);

myAlbum.get(2);

var songs = new Backbone.Collection;
songs.url = '/songs';
songs.fetch();

var obj = {};
_.extend(obj, Backbone.Events);

obj.on("show-message", function(msg){
	$('#display').text(msg);
});

obj.trigger("show-message", "Hello world");

