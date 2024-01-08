<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UserService;
use Symfony\Component\Security\Http\Attribute\CurrentUser;


class UserController extends AbstractController
{
    #[Route('/user/register', name: 'user_register', methods: ['POST'])]
    public function register(UserService $userService, Request $request): JsonResponse
    {
        return $this->json($userService->createUser($request));
    }

    #[Route('/user/login', name: 'user_login')]
    public function login(UserService $userService,#[CurrentUser] ?User $user): Response
    {
        return $this->json($userService->authUser($user));

    }
//
//    #[Route('/user/reset-password', name: 'user_reset_password', methods: ['PUT'])]
//    public function resetPassword(): JsonResponse
//    {
//        return $this->render('user/index.html.twig', [
//            'controller_name' => 'UserController',
//        ]);
//    }


}
