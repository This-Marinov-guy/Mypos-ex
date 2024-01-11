<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;


class UserController extends AbstractController
{
    #[Route('/user/register', name: 'api_user_register')]
    public function register(Request $request, UserService $userService): Response
    {
        return $this->json($userService->createUser($request));
    }

    #[Route('/user/login', name: 'api_user_login')]
    public function login(#[CurrentUser] ?User $user): void
    {
    }

    #[Route('/user/reset-password', name: 'user_reset_password')]
    public function resetPassword(Request $request, UserService $userService): Response
    {
        return $this->json($userService->resetPassword($request));

    }

}
