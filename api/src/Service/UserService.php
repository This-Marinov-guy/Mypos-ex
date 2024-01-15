<?php

namespace App\Service;

use App\Constants\Regex;
use App\Constants\Roles;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Symfony\Component\Serializer\SerializerInterface;

class UserService extends AbstractController
{
	public function __construct(
		private UserRepository              $userRepository,
		private ManagerRegistry             $doctrine,
		private SerializerInterface         $serializer,
		private UserPasswordHasherInterface $passwordHasher,
		public EncoderInterface             $encoder,
	) {
	}

	public
	function getUserFromJWTToken(
		$request
	): ?User {

		$authHeader = $request->headers->get('Authorization');
		$authToken = null;

		if (preg_match(Regex::Bearer, $authHeader, $matches)) {
			$authToken = $matches[1];
		}

		if (!$authToken) {
			return null;
		}

		$decodedToken = json_decode(
			base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $authToken)[1]))),
			true
		);

		return $this->userRepository->findOneBy(['email' => $decodedToken['username']]);
	}

	public
	function createUser(
		$request
	): array {
		try {
			['password' => $password] = json_decode($request->getContent(), true);

			$user = $this->serializer->deserialize($request->getContent(), User::class, 'json');

			$errors = $this->userRepository->validate($user);
			if (
				$errors
			) {
				return [
					'message' => $errors,
					'code'    => 422,
				];
			}

			$hashedPassword = $this->passwordHasher->hashPassword(
				$user,
				$password,
			);

//          $user->setRoles(Roles::ADMIN);
			$user->setRoles(Roles::USER);
			$user->setPassword($hashedPassword);

			$em = $this->doctrine->getManager();
			$em->persist($user);
			$em->flush();

			return [
				'message' => 'User registered!',
				'code'    => 200,
			];
		} catch (Exception $e) {
			if ($e->getCode() == 19) {
				return [
					'message' => 'User already exists',
					'code'    => $e->getCode(),
				];
			} else {
				return [
					'message' => 'Server error',
					'code'    => $e->getCode(),
				];
			}
		}
	}

	public
	function resetPassword(
		$request
	): array {
		['email' => $email, 'newPassword' => $newPassword] = json_decode($request->getContent(), true);

		if (!preg_match(Regex::PASSWORD, $newPassword)) {
			return [
				'message' => 'New Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
				'code'    => 422,
			];
		}

		$user = $this->userRepository->findBy(["email" => $email])[0];

		if (!$user) {
			return [
				'message' => 'No such user',
				'code'    => 404,
			];
		}

		$factory = new PasswordHasherFactory([
			'common'      => ['algorithm' => 'bcrypt'],
			'memory-hard' => ['algorithm' => 'sodium'],
		]);

		$passwordHasher = $factory->getPasswordHasher('common');

		$hash = $passwordHasher->hash($newPassword);

		$this->userRepository->upgradePassword($user, $hash);

		return [
			'message' => 'Password changed successfully!',
			'code'    => 200,
		];

	}

}