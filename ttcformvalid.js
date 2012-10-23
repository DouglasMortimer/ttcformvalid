function Validator(form_name, callback) {
	var form = document.forms[form_name];
	
	/*
		Trim is separated from all the other rules
		to avoid mistakes while testing those other rules
	*/
	//	TODO: rename trim_array to prepping_array
	var trim_array = new Array();
	var rules_array = new Array();
	var err_array = new Array();
	var passed = true;
	
	//-----------------------------
	//	Internal functions
	//-----------------------------
	
	function failed(rule) {
		err_array.push(rule);
		passed = false;
	}
	
	function check_email(email) {
		var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,4}$/;
		if (!pattern.test(email)) {
			return false;
		}
		return true;
	}
	
	//-----------------------------
	//	Prepping functions
	//-----------------------------
	
	function trim(val) {
		return val.replace(/^\s+|\s+$/g,"");
	}
	
	function xss_clean() {
		
	}
	
	function prep_for_form() {
		
	}
	
	function prep_url() {
		
	}
	
	function strip_image_tags() {
		
	}
	
	function encode_php_tags(rule) {
		form[rule.field].value = form[rule.field].value.replace(/</, "&lt;");
		form[rule.field].value = form[rule.field].value.replace(/>/, "&gt;");
	}
	
	//-----------------------------
	//	Rule checking functions
	//-----------------------------
	
	function required(rule) {
		if (form[rule.field].value == "" || form[rule.field].value == null) {
			failed(rule);
		}
	}
	
	function matches(rule) {
		var who = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
		if (form[rule.field].value != form[who].value) {
			failed(rule);
		}
	}
	
	function is_unique(rule) {
		
	}
	
	function min_length(rule) {
		var length = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
		if (form[rule.field].value.length < length) {
			failed(rule);
		}
	}
	
	function max_length(rule) {
		var length = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
		if (form[rule.field].value.length > length) {
			failed(rule);
		}
	}
	
	function exact_length(rule) {
		var length = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
		if (form[rule.field].value.length != length) {
			failed(rule);
		}
	}
	
	function greater_than(rule) {
		var value = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
		if (form[rule.field].value < value) {
			failed(rule);
		}
	}
	
	function less_than(rule) {
		var value = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
		if (form[rule.field].value > value) {
			failed(rule);
		}
	}
	
	function alpha(rule) {
		var pattern = /^[a-z]+$/i;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function alpha_numeric(rule) {
		var pattern = /^([a-z0-9])+$/i;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function alpha_dash(rule) {
		var pattern = /^([-a-z0-9_-])+$/i;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function numeric(rule) {
		var pattern = /^[\-+]?[0-9]*\.?[0-9]+$/;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function integer(rule) {
		var pattern = /^[\-+]?[0-9]+$/;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function decimal(rule) {
		var pattern = /^[\-+]?[0-9]+\.[0-9]+$/;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function is_natural(rule) {
		var pattern = /^[0-9]+$/;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function is_natural_no_zero(rule) {
		var pattern = /^[0-9]+$/;
		if (!pattern.test(form[rule.field].value) || form[rule.field].value == 0) {
			failed(rule);
		}
	}
	
	function valid_email(rule) {
		if (!check_email(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function valid_emails(rule) {
		var e_string = form[rule.field].value;
		var emails = e_string.split(",");
		for (var i = 0; i < emails.length; i++) {
			if (!check_email(trim(emails[i]))) {
				failed(rule);
				return;
			}
		}
	}
	
	function valid_ip(rule) {
		var pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	function valid_base64(rule) {
		var pattern = /[^a-zA-Z0-9\/\+=]/;
		if (!pattern.test(form[rule.field].value)) {
			failed(rule);
		}
	}
	
	this.setRules = function(field, label, rules) {
		//	If label not set use field name
		label = (label == "") ? field : label;
		
		rules = rules.split("|");
		for (var i = 0; i < rules.length; i++) {
			//	TODO: check if rule belongs to prepping array and push it there
			//	Check if the rule is "trim"
			if (rules[i] == "trim") {
				trim_array.push({"field":field});
			} else {
				rules_array.push({"field":field, "label":label, "rule":rules[i]});
			}
		}
	};
	
	this.run = function() {
		passed = true;
		//	TODO: First do all of the prepping functions
		//	First do all of the trimming
		for (var i = 0; i < trim_array.length; i++) {
			var polje = form[trim_array[i].field];
			polje.value = trim(polje.value);
		}
		
		document.getElementById('ispis').innerHTML = "";
		for (var i = 0; i < rules_array.length; i++) {
			var rule = rules_array[i];
			var polje = form[rule.field];
			
			if (rule.rule == "required") {
				required(rule);
			} else if (rule.rule == "is_unique") {
				//	TODO: is_unique
			} else if (rule.rule == "valid_email") {
				valid_email(rule);
			} else if (rule.rule == "valid_emails") {
				valid_emails(rule);
			} else if (rule.rule == "valid_ip") {
				valid_ip(rule);
			} else if (rule.rule == "alpha") {
				alpha(rule);
			} else if (rule.rule == "alpha_numeric") {
				alpha_numeric(rule);
			} else if (rule.rule == "alpha_dash") {
				alpha_dash(rule);
			} else if (rule.rule == "numeric") {
				numeric(rule);
			} else if (rule.rule == "integer") {
				integer(rule);
			} else if (rule.rule == "decimal") {
				decimal(rule);
			} else if (rule.rule == "is_natural") {
				is_natural(rule);
			} else if (rule.rule == "is_natural_no_zero") {
				is_natural_no_zero(rule);
			} else if (rule.rule == "valid_base_64") {
				valid_base64(rule);
			} else if (rule.rule == "encode_php_tags") {
				//	TODO: move this to the front like trim
				encode_php_tags(rule);
			} else if (/matches/g.test(rule.rule)) {
				matches(rule);
			} else if (/min_length/g.test(rule.rule)) {
				min_length(rule);
			} else if (/max_length/g.test(rule.rule)) {
				max_length(rule);
			} else if (/exact_length/g.test(rule.rule)) {
				exact_length(rule);
			} else if (/greater_than/g.test(rule.rule)) {
				greater_than(rule);
			} else if (/less_than/g.test(rule.rule)) {
				less_than(rule);
			}
		}
		
		//	If the callback function exists
		if (callback instanceof Function) {
			//	Run it with error array as an argument
			callback(err_array);
		}
		return passed;
	};
}
