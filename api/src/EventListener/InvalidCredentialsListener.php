<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
class InvalidCredentialsListener {
    public function index(AuthenticationFailureEvent $event): void
    {
        $response = new JsonResponse([
            'error' => 'Invalid Credentials',
            'code' => 401
        ]);

        $event->setResponse($response);
    }
}
