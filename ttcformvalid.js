function Validator(form_name) {
	//	TODO: Add callback function
	var form = document.forms[form_name];
	
	/*
		Trim is separated from all the other rules
		to avoid mistakes while testing those other rules
	*/
	var trim_array = new Array();
	var rules_array = new Array();
	var err_array = new Array();
	
	function trim(val) {
		return val.replace(/^\s+|\s+$/g,"");
	}
	
	this.setRules = function(field, label, rules) {
		//	If label not set use field name
		label = (label == "") ? field : label;
		
		rules = rules.split("|");
		for (var i = 0; i < rules.length; i++) {
			//	Check if the rule is "trim"
			if (rules[i] == "trim") {
				trim_array.push({"field":field});
			} else {
				rules_array.push({"field":field, "label":label, "rule":rules[i]});
			}
		}
	};
	
	this.run = function() {
		var passed = true;
		//	First do all of the trimming
		for (var i = 0; i < trim_array.length; i++) {
			var polje = form[trim_array[i].field];
			polje.value = trim(polje.value);
		}
		
		document.getElementById('ispis').innerHTML = "";
		for (var i = 0; i < rules_array.length; i++) {
			//	TODO: implement missing CI rules!!!
			//	TODO: maybe move all of these to separate functions?
			var rule = rules_array[i];
			var polje = form[rule.field];
			if (rule.rule == "required") {
				if (form[rule.field].value == "" || form[rule.field].value == null) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "valid_email") {
				pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,4}$/;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "valid_ip") {
				pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "alpha") {
				pattern = /^[a-z]+$/i;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "alpha_numeric") {
				pattern = /^([a-z0-9])+$/i;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "alpha_dash") {
				pattern = /^([-a-z0-9_-])+$/i;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "numeric") {
				pattern = /^[\-+]?[0-9]*\.?[0-9]+$/;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "integer") {
				pattern = /^[\-+]?[0-9]+$/;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "decimal") {
				pattern = /^[\-+]?[0-9]+\.[0-9]+$/;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "is_natural") {
				pattern = /^[0-9]+$/;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "is_natural_no_zero") {
				pattern = /^[0-9]+$/;
				if (!pattern.test(form[rule.field].value) || form[rule.field].value == 0) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "valid_base_64") {
				pattern = /[^a-zA-Z0-9\/\+=]/;
				if (!pattern.test(form[rule.field].value)) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (rule.rule == "encode_php_tags") {
				form[rule.field].value = form[rule.field].value.replace(/</, "&lt;");
				form[rule.field].value = form[rule.field].value.replace(/>/, "&gt;");
			} else if (/match/g.test(rule.rule)) {
				var who = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
				if (form[rule.field].value != form[who].value) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (/min_length/g.test(rule.rule)) {
				var length = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
				if (form[rule.field].value.length <= length) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (/max_length/g.test(rule.rule)) {
				var length = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
				if (form[rule.field].value.length >= length) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (/exact_length/g.test(rule.rule)) {
				var length = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
				if (form[rule.field].value.length != length) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (/greater_than/g.test(rule.rule)) {
				var value = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
				if (form[rule.field].value < value) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			} else if (/less_than/g.test(rule.rule)) {
				var value = rule.rule.substr(rule.rule.indexOf("[") + 1, rule.rule.indexOf("]") - rule.rule.indexOf("[") - 1);
				if (form[rule.field].value > value) {
					document.getElementById('ispis').innerHTML = document.getElementById('ispis').innerHTML + rule.label + ": " + rule.rule + "<br>";
					err_array.push(rule);
					passed = false;
				}
			}
		}
		return passed;
	};
}
