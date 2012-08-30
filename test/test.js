function validate(formName) {
	var v = new Validator(formName);
	v.setRules("firstname", "First Name", "trim|required|min_length[5]|max_length[12]");
	v.setRules("lastname", "Last Name", "trim|required|min_length[5]|max_length[12]");
	v.setRules("password", "Password", "trim|required|is_natural");
	v.setRules("passconf", "Password Confirmation", "trim|encode_php_tags");
	v.setRules("email", "Email", "trim|required|valid_email");
	return v.run();
}
