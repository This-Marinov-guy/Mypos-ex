<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Symfony\Component\Serializer\SerializerInterface;

class UserService
{
    public function __construct(private UserRepository $userRepository, private ManagerRegistry $doctrine, private SerializerInterface $serializer, private UserPasswordHasherInterface $passwordHasher, public EncoderInterface $encoder)
    {
    }

    public function createUser($request): array
    {
        try {
            ['password' => $password] = json_decode($request->getContent(), true);

            $user = $this->serializer->deserialize($request->getContent(), User::class, 'json');
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $password,
            );

            $user->setRoles(array('USER_ADMIN'));
            $user->setPassword($hashedPassword);

            $em = $this->doctrine->getManager();
            $em->persist($user);
            $em->flush();

            return [
                'message' => 'User registered!',
                'code' => 200,
                'data' => $user
            ];
        } catch (Exception $e) {
            if ($e->getCode() == 19) {
                return [
                    'error' => 'User already exists',
                    'code' => $e->getCode()
                ];
            } else {
                return [
                    'error' => 'Server error',
                    'code' => $e->getCode()
                ];
            }
        }
    }

    public function resetPassword($request): array
    {
        ['email' => $email, 'newPassword' => $newPassword] = json_decode($request->getContent(), true);
        $user = $this->userRepository->findBy(["email" => $email])[0];

        if (!$user) {
            return [
                'error' => 'No such user',
                'code' => 404
            ];
        }

        $factory = new PasswordHasherFactory([
            'common' => ['algorithm' => 'bcrypt'],
            'memory-hard' => ['algorithm' => 'sodium'],
        ]);

        $passwordHasher = $factory->getPasswordHasher('common');

        $hash = $passwordHasher->hash($newPassword);

        $this->userRepository->upgradePassword($user, $hash);

        return [
            'message' => 'Password changed successfully!',
            'code' => 200,
        ];

    }

}