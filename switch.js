function Switch(el, opts) {

	opts = opts || {};

	this.$el  = $(el);
	this.firstChoice = $(this.$el.children()[0]);
	this.secondChoice = $(this.$el.children()[1]);
	this.baseColor = this.firstChoice.css('color');
	this.hoverColor = darkenOrLighten(this.baseColor, 0.15); 
	this.id = opts.id;
	this.title = opts.title;
	this.opts = opts;
	this.$el.data('switch', this);

	this.init();
}

Switch.prototype.init = function() {
	var self = this;
		
	this.toggle = $('<div class="ui toggle checkbox"></div>');
	if (this.id) this.toggle.attr('id', this.id);
	if (this.title) this.toggle.attr('title', this.title);
	this.toggle.append($('<input type="checkbox">'));
	this.firstChoice.after(this.toggle);
	this.firstChoice.addClass('switch-option');
	this.secondChoice.addClass('switch-option');	

	this.toggle.checkbox(this.opts);
	this.firstChoice.on('click', function() {
		self.toggle.checkbox('uncheck');
	}).hover(function() {
		$(this).css('color', self.hoverColor);
	}, function() {
		$(this).css('color', '');
	});
	this.secondChoice.on('click', function() {
		self.toggle.checkbox('check');
	}).hover(function() {
		$(this).css('color', self.hoverColor);
	}, function() {
		$(this).css('color', '');
	});
};

Switch.prototype.destroy = function() {
	this.$el.removeData();
	this.$el.off();	
};

Switch.prototype.settings = {
  	onChange: function(value) {}
 };


$.fn.switch = function() {

	var $allModules = $(this),
	$window     = $(window),
	$document   = $(document),
	$body       = $('body'),

	query           = arguments[0],
	methodInvoked   = (typeof query == 'string'),
	queryArguments  = [].slice.call(arguments, 1),
	moduleNamespace = 'switch',

	returnedValue;

	$allModules.each( function() {

		var $module = $(this),
			element = this,
			instance = $module.data(moduleNamespace),
			returnValue;

		module = {

			initialize: function(opts) {
				return new Switch($module, opts);
			},
			destroy: function() {
				return instance && instance.destroy();
			},
			invoke: function(query, passedArguments, context) {
				var object = instance,
					maxDepth,
					found = module[query],
					response;

				passedArguments = passedArguments || queryArguments;
				context         = element         || context;

				if ( $.isFunction( found ) ) {
					response = found.apply(context, passedArguments);
				}
				else if(found !== undefined) {
					response = found;
				}
				if($.isArray(returnedValue)) {
					returnedValue.push(response);
				}
				else if(returnedValue !== undefined) {
					returnedValue = [returnedValue, response];
				}
				else if(response !== undefined) {
					returnedValue = response;
				}
				return found;
			},
			'check': function() {
				return instance && instance.toggle.checkbox('check');
			},
			'uncheck': function() {
				return instance && instance.toggle.checkbox('uncheck');
			},
			'toggle': function() {
				return instance && instance.toggle.checkbox('toggle');
			},
			'is checked': function() {
				return instance && instance.toggle.checkbox('is checked');
			}
		};

		if(methodInvoked) {
			if(instance === undefined) {
				module.initialize();
			}
			module.invoke(query);
		}
		else {
			if(instance !== undefined) {
				module.destroy();
			}
			if ($.isPlainObject(query)) {
				if (instance === undefined) {
					instance = module.initialize(query);
				}
				_.extend(instance.settings, query);
			} else if (instance === undefined) {
				instance = module.initialize();
			}
		}

	});

  	return (returnedValue !== undefined)
    	? returnedValue
    	: this;

};

function darkenOrLighten(colorRGB, factor) {
  var regex = /rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?(\d(?:\.\d+)?))?\)/,
    cols = regex.exec(colorRGB),
    newCols = [],
    colFunc,
    alpha = cols.pop(),
    newColRGB;

  if (typeof cols[3] === 'undefined') return null;

  cols.shift();
  cols = _.map(cols, parseFloat);
  if (cols.length === 4) newCols[3] = cols.pop();

  colFunc = _.reduce(cols, function(a, b) {return a + b;}) > 382.5 ?
        function(col) { return Math.round(col * (1 - factor)); } :
        function(col) { return Math.round(col + ((255 - col) * factor)); };

  _.each(cols, function(col, i) {
    newCols[i] = colFunc(col);
  });

  newColRGB = 'rgb' + (alpha ? 'a' : '') + '(' +
      _.reduce(newCols, function(str, col) {
        return str + col.toString() + ', ';
      }, '') + (alpha ? alpha + ', ' : '');
  newColRGB = newColRGB.substr(0, newColRGB.length - 2) + ')';

  return newColRGB;
}