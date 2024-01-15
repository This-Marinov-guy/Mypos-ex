<?php

namespace App\Command;

use App\Constants\Roles;
use App\Entity\User;
use Doctrine\DBAL\Exception;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactory;

class CreateAdminCommand extends Command
{
	public function __construct(private ManagerRegistry $doctrine)
	{
		parent::__construct();
	}

	protected function configure()
	{
		$this
			// the name of the command (the part after "app/console")
			->setName('create-admin')
			// the short description shown while running "php app/console list"
			->setDescription('Creates admin user.');
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		try {
			$user = new User();

			$user->setName('Admin');
			$user->setEgn('012345689');
			$user->setEmail('admin@test.com');

			$factory = new PasswordHasherFactory([
				'common'      => ['algorithm' => 'bcrypt'],
				'memory-hard' => ['algorithm' => 'sodium'],
			]);

			$passwordHasher = $factory->getPasswordHasher('common');

			$hash = $passwordHasher->hash('Admin123!');

			$user->setPassword($hash);

			$user->setRoles(Roles::ADMIN);

			$em = $this->doctrine->getManager();
			$em->persist($user);
			$em->flush();

			$output->writeln([
				'Admin Created',
				'============',
				'email: admin@test.com',
				'password: Admin123!',
			]);
		} catch (Exception $e) {
			$output->writeln([
				'Admin has already been created',
				'============',
				'email: admin@test.com',
				'password: Admin123!',
			]);
		}

		return 1;
	}
}