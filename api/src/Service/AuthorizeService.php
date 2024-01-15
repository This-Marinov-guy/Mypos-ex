<?php

namespace App\Service;

use App\Constants\Roles;

class AuthorizeService
{
    public function __construct(private UserService $userService)
    {
    }

    public function authorizeUserAppointmentActions($request, $appointment): array
    {
        $user = $this->userService->getUserFromJWTToken($request);

        if ($request->headers->get('Authorization') && $user->getEmail() === $appointment->getUser()->getEmail() || !array_diff(Roles::ADMIN, $user->getRoles())) {
            return [
                'access' => true,
                'message' => 'Access granted',
                'code' => 200,
            ];
        } else {
            return [
                'access' => false,
                'message' => 'Unauthorized user',
                'code' => 401
            ];
        }

    }

    public function authorizeAdmin($request): array
    {
        $user = $this->userService->getUserFromJWTToken($request);

        if ($request->headers->get('Authorization') && !array_diff(Roles::ADMIN, $user->getRoles())) {
            return [
                'access' => true,
                'message' => 'Access granted',
                'code' => 200,
            ];
        } else {
            return [
                'access' => false,
                'message' => 'Unauthorized user - only for admins',
                'code' => 401
            ];
        }
    }

}