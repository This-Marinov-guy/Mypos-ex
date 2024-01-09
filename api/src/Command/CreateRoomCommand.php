<?php

namespace App\Command;

use App\Entity\Room;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateRoomCommand extends Command
{
    public function __construct(private ManagerRegistry $doctrine)
    {
        parent::__construct();
    }

    protected function configure()
    {
        $this
            // the name of the command (the part after "app/console")
            ->setName('app:create-room')
            // the short description shown while running "php app/console list"
            ->setDescription('Creates a new room.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $room = new Room();

        $em = $this->doctrine->getManager();
        $em->persist($room);
        $em->flush();

        $output->writeln([
            'Room Created',
            '============',
            '',
        ]);

        return 1;
    }
}