<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    public function __construct(private UserRepository $userRepository, private ManagerRegistry $doctrine, private SerializerInterface $serializer, private UserPasswordHasherInterface $passwordHasher, private TokenStorageInterface $tokenStorageInterface,private JWTTokenManagerInterface $jwtManager)
    {
    }

    public function createUser($request): array
    {
            try {
                $user = $this->serializer->deserialize($request->getContent(), User::class, 'json');
                $hashedPassword = $this->passwordHasher->hashPassword(
                    $user,
                    $request->query->get('password', '123'),
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
            } catch (\Exception $e) {
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


}