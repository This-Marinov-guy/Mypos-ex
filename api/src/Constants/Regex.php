<?php

namespace App\Constants;

class Regex
{
	const PASSWORD = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
	const EGN = "/^(?:[0-9]){10}$/";
	const Bearer = '/Bearer\s+(.*)$/i';
}