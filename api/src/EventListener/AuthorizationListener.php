<?php

namespace App\EventListener;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class AuthorizationListener extends AbstractController implements EventSubscriberInterface {
   public static function getSubscribedEvents(): array
   {
       return [
           KernelEvents::REQUEST => 'onKernelRequest'
       ];
   }

   public function onKernelRequest(RequestEvent $event): void
   {
       $request = $event->getRequest();
       $routeName = $request->attributes->get('_route');

       if ($routeName === 'admin_route') {
           if (!$this->isGranted('ROLE_ADMIN')) {
               $response = new JsonResponse([
                   'error' => 'You need to be Admin to access',
                   'code' => 401
               ]);

               $event->setResponse($response);
           }
       }
   }}
