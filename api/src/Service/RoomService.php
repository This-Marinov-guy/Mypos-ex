<?php

namespace App\Service;

use App\Constants\RoomConfig;
use App\Repository\RoomRepository;

class RoomService
{
	public function __construct(private RoomRepository $roomRepository)
	{
	}

	public function availableRoom()
	{
		$rooms = $this->roomRepository->findAll();
		$targetRoom = null;

		for ($x = 0; $x < count($rooms); $x++) {
			if ($rooms[$x]->getSize() < RoomConfig::LIMIT) {
				$targetRoom = $rooms[$x];
				break;
			}
		}
		if ($targetRoom) {
			for ($x = 0; $x < count($rooms); $x++) {
				if ($rooms[$x]->getSize() < $targetRoom->getSize()) {
					$targetRoom = $rooms[$x];
				}
			}
		}

		return $targetRoom;
	}

}