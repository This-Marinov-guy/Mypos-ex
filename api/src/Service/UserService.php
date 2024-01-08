<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

class UserService
{
    public function __construct(private UserRepository $userRepository, private ManagerRegistry $doctrine, private SerializerInterface $serializer, private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function createUser($request): array
    {
        try {
            $user = $this->serializer->deserialize($request->getContent(), User::class, 'json');

            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $request->request->get('password'),
            );
            $user->setPassword($hashedPassword);

            $user->setRoles(array('ROLE_USER'));

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
                    'error' => 'User Already exists',
                    'code' => 500,
                ];
            } else {
                return [];
            }
        }
    }

    public function authUser($user): array
    {
        if (!$user) {
            return
                [
                    'error' => 'Invalid Credentials',
                    'code' => 401,
                ];
        }

        return [
            "role" => $user->getRoles(),
        ];
    }
}