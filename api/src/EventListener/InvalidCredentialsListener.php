<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Symfony\Component\HttpFoundation\JsonResponse;

class InvalidCredentialsListener
{
    public function index(AuthenticationFailureEvent $event): void
    {
        $response = new JsonResponse([
            'message' => 'Invalid Credentials!',
            'code' => 401
        ]);

        $event->setResponse($response);
    }
}
