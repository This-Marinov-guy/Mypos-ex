<?php

namespace App\Entity;

use App\Repository\AppointmentRepository;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AppointmentRepository::class)]

class Appointment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id;

    #[ORM\Column(type: 'datetime')]
    #[Assert\NotBlank]
    #[Assert\GreaterThan("today", message: "Date cannot be in the past")]

    private ?\DateTimeInterface $date;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]

    private ?string $name;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: "/^(?:[0-9]){10}$/", message: "The value must be exactly 10 digits.")]
    private ?string $egn;

    #[ORM\Column(length: 1000)]
    #[Assert\NotBlank]
    #[Assert\Length(10)]

    private ?string $details;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getEgn(): ?string
    {
        return $this->egn;
    }

    public function setEgn(string $egn): static
    {
        $this->egn = $egn;

        return $this;
    }

    public function getDetails(): ?string
    {
        return $this->details;
    }

    public function setDetails(string $details): static
    {
        $this->details = $details;

        return $this;
    }
}
