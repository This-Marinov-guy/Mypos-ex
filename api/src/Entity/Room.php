<?php

namespace App\Entity;

use App\Repository\RoomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[MaxDepth(1)]
	#[ORM\OneToMany(mappedBy: 'room', targetEntity: Appointment::class, fetch: 'EXTRA_LAZY', orphanRemoval: true)]
	#[Ignore]
	private Collection $appointments;

	public function __construct()
	{
		$this->appointments = new ArrayCollection();
	}

	public function getId(): ?int
	{
		return $this->id;
	}

	/**
	 * @return Collection<int, Appointment>
	 */
	public function getAppointments(): Collection
	{
		return $this->appointments;
	}

	public function getSize(): int
	{
		return count($this->appointments);
	}

	public function addAppointment(Appointment $appointment): static
	{
		if (!$this->appointments->contains($appointment)) {
			$this->appointments->add($appointment);
			$appointment->setRoom($this);
		}

		return $this;
	}

	public function removeAppointment(Appointment $appointment): static
	{
		if ($this->appointments->removeElement($appointment)) {
			// set the owning side to null (unless already changed)
			if ($appointment->getRoom() === $this) {
				$appointment->setRoom(null);
			}
		}

		return $this;
	}
}
