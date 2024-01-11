<?php

namespace App\Service;

use App\Repository\UserRepository;

class AuthorizeService
{
    public function __construct(private UserRepository $userRepository, private UserService $userService)
    {
    }

    public function authorizeUserAppointmentActions($request, $appointment): array
    {
        $user = $this->userService->getUserFromJWTToken($request);

        if ($request->headers->get('Authorization') && $user->getEmail() === $appointment->getUser()->getEmail() || in_array('ROLE_ADMIN', $user->getRoles())) {
             return [
                'access' => true,
                'message' => 'Access granted',
                'code' => 200,
            ];
        } else {
            return [
                'access' => false,
                'error' => 'Unauthorized user',
                'code' => 401
            ];
        }

    }

    public function authorizeAdmin($request): array
    {

        if ($request->headers->get('Authorization') && in_array('ROLE_ADMIN', $this->userService->getUserFromJWTToken($request)->getRoles())) {
            return [
                'access' => true,
                'message' => 'Access granted',
                'code' => 200,
            ];
        } else {
            return [
                'access' => false,
                'error' => 'Unauthorized user - only for admins',
                'code' => 401
            ];
        }
    }

}