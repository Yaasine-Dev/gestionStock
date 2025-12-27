import hashlib
from typing import Optional


def hash_password(password: str) -> str:
	"""Return a SHA-256 hex digest for the given password."""
	return hashlib.sha256(password.encode()).hexdigest()


if __name__ == "__main__":
	import argparse

	parser = argparse.ArgumentParser()
	parser.add_argument("password", nargs="?", default="1234")
	args = parser.parse_args()
	print("Hash pour le mot de passe:", hash_password(args.password))
