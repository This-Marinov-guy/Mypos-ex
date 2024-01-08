<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

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
                $request->pasword,
            );
            $user->setPassword($hashedPassword);

            $em = $this->doctrine->getManager();
            $em->persist($user);
            $em->flush();

            return [
                'message' => 'User Created!',
                'code' => 200,
                'data' => $user
            ];
        } catch (\Exception $e) {
            return [
                'message' => 'Creating Fail',
                'code' => 500,
            ];
        }
    }

}