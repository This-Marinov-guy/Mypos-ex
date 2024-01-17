<?php

namespace App\Service;

use LogicException;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use UnitEnum;

abstract class AbstractService
{
	/**
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * Gets a container parameter by its name.
	 */
	protected function getParameter(string $name): array|bool|string|int|float|UnitEnum|null
	{
		if (!$this->container->has('parameter_bag')) {
			throw new ServiceNotFoundException(
				'parameter_bag.',
				null,
				null,
				[],
				sprintf(
					'The "%s::getParameter()" method is missing a parameter bag to work properly. Did you forget to register your controller as a service subscriber? This can be fixed either by using autoconfiguration or by manually wiring a "parameter_bag" in the service locator passed to the controller.',
					static::class
				)
			);
		}

		return $this->container->get('parameter_bag')->get($name);
	}

	/**
	 * Get a user from the Security Token Storage.
	 *
	 * @throws LogicException If SecurityBundle is not available
	 *
	 * @see TokenInterface::getUser()
	 */
	protected function getUser(): ?UserInterface
	{
		if (!$this->container->has('security.token_storage')) {
			throw new LogicException(
				'The SecurityBundle is not registered in your application. Try running "composer require symfony/security-bundle".'
			);
		}

		if (null === $token = $this->container->get('security.token_storage')->getToken()) {
			return null;
		}

		return $token->getUser();
	}

}