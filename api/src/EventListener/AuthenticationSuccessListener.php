<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

class AuthenticationSuccessListener{

    public function index(AuthenticationSuccessEvent $event): void
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user) {
            return;
        }

        $data['data'] = array(
            'roles' => $user->getRoles(),
        );

        $data['message'] = 'Welocome Back!';

        $data['code'] = 200;

        $event->setData($data);
    }
}