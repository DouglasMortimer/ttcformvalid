function validate(formName) {
	var v = new Validator(formName, function(errs) {
		var err_out = document.getElementById("ispis");
		for (i = 0; i < errs.length; i++) {
			var rule = errs[i];
			err_out.innerHTML = err_out.innerHTML + rule.label + ": " + rule.rule + "<br>";
		}
	});
	v.setRules("firstname", "First Name", "trim|required|min_length[5]|max_length[12]");
	v.setRules("lastname", "Last Name", "trim|required|min_length[5]|max_length[12]");
	v.setRules("password", "Password", "trim|required|is_natural");
	v.setRules("passconf", "Password Confirmation", "trim|encode_php_tags|matches[password]");
	v.setRules("email", "Email", "trim|required|valid_email");
	return v.run();
}
