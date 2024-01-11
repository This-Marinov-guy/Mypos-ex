<?php

namespace App\Service;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class AuthorizeService
{
    public function __construct(private UserRepository $userRepository, private TokenStorageInterface $tokenStorageInterface, private JWTTokenManagerInterface $jwtManager)
    {
    }

    public function authorizeUser($userId, $permissionId, $request): array
    {
        $headerToken = $request->headers->get('Authorization');
        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());
        $isUserAdmin = in_array('ROLE_ADMIN', $this->userRepository->find($userId)->getRoles());

        if ($decodedJwtToken !== $headerToken || ($userId !== $permissionId || !$isUserAdmin)) {
            return [
                'access' => false,
                'error' => 'Unauthorized user',
                'code' => 401
            ];
        } else {
            return [
                'access' => true,
                'message' => 'Access granted',
                'code' => 200
            ];
        }
    }

    public function authorizeAdmin($userId, $request): array
    {

        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());
        $isUserAdmin = in_array('ROLE_ADMIN', $this->userRepository->find($userId)->getRoles());

        if ($decodedJwtToken !== $authToken || !$isUserAdmin) {
            return [
                'access' => false,
                'error' => 'Unauthorized user - only for admins',
                'code' => 401
            ];
        } else {
            return [
                'access' => true,
                'message' => 'Access granted',
                'code' => 200
            ];
        }
    }

}