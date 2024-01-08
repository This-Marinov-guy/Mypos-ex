<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    public function __construct(private UserRepository $userRepository, private ManagerRegistry $doctrine, private SerializerInterface $serializer, private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function createUser($request)
    {
            if ($this->userRepository->findOneByEmail( $request->query->get('email'))) {
                return [
                    'error' => 'User Already exists',
                    'code' => 500,
                ];
            }

            $user = $this->serializer->deserialize($request->getContent(), User::class, 'json');
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $request->query->get('password'),
            );

            $user->setRoles(array('USER_ADMIN'));
            $user->setPassword($hashedPassword);

            $em = $this->doctrine->getManager();
            $em->persist($user);
            $em->flush();

            return [
                'error' => 'User registered!',
                'code' => 200,
                'data' => $user
            ];


    }

}