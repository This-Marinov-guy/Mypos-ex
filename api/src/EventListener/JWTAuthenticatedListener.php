<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTAuthenticatedEvent;

class JWTAuthenticatedListener{

    public function index(JWTAuthenticatedEvent $event): void
    {
        $token = $event->getToken();

        $payload = $event->getPayload();

        $token->setAttribute('uuid', $payload['uuid']);
    }
}