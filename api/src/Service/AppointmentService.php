<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Repository\RoomRepository;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class AppointmentService
{
    public function __construct(private AppointmentRepository $appointmentRepository, private RoomRepository $roomRepository, private ManagerRegistry $doctrine, private SerializerInterface $serializer)
    {
    }

    public function filterPaginated(Request $request): array
    {
        $filters = array_combine(
            ['dateFrom', 'dateTo', 'name', 'egn', 'details'],
            array_map(fn($param) => $request->query->get($param), ['dateFrom', 'dateTo', 'name', 'egn', 'details'])
        );

        $page = $request->query->get('page') ?: 1;

        $queryBuilder = $this->appointmentRepository->applyFilters($filters);

        ['paginator' => $paginator, 'pagesCount' => $pagesCount] = $this->appointmentRepository->paginateQuery($queryBuilder, $page);

        $appointments = $paginator->getIterator();

        if (!$appointments) {
            return [
                'error' => 'Failed to fetch',
                'code' => 500,
            ];
        }

        return [
            'message' => 'success',
            'code' => 200,
            'data' => $appointments,
            'pagesCount' => $pagesCount,
        ];


    }

    public function filterName($appointment): array
    {
        $appointments = $this->appointmentRepository->findBy(['name' => $appointment->getName()], ['date' => 'ASC']);

        if (!$appointments) {
            return [
                'error' => 'fail',
                'code' => 500,
            ];
        }

        return [
            'message' => 'success',
            'code' => 200,
            'data' => array_values(array_filter($appointments, function ($a) use ($appointment) {
                return $a->getId() !== $appointment->getId() && $a->getDate() > new DateTime();
            }))
        ];


    }

    public function createAppointment($request, $user): array
    {
        $appointment = $this->serializer->deserialize($request->getContent(), Appointment::class, 'json');

        if (!$appointment) {
            return [
                'error' => 'Failed to add',
                'code' => 500,
            ];
        }

        $rooms = $this->roomRepository->findAll();
        $LIMIT = 8;
        $targetRoom = $rooms[0]->getSize() < $LIMIT ? $rooms[0] : null ;

        for ($x = 0; $x < count($rooms); $x++) {
            if ( $targetRoom && $rooms[$x]->getSize() < $targetRoom->getSize()) {
                if ($rooms[$x]->getSize() < $LIMIT) {
                    $targetRoom = $rooms[$x];
                }
            }
        }

        if (!$targetRoom) {
            return [
                'error' => 'All rooms are full',
                'code' => 500,
            ];
        }

        $appointment->setName($user->getName());
        $appointment->setEgn($user->getEgn());
        $appointment->setRoom($targetRoom);
        $appointment->setUser($user);

        $em = $this->doctrine->getManager();
        $em->persist($targetRoom);
        $em->persist($appointment);
        $em->persist($user);
        $em->flush();

        return [
            'message' => 'Appointment Added!',
            'code' => 200,
            'data' => ['groups' => 'appointment','user', 'room']
        ];

    }

    public function updateAppointment($appointment, $request): array
    {
        try {
            $em = $this->doctrine->getManager();

            $this->serializer->deserialize($request->getContent(), Appointment::class, 'json', ['object_to_populate' => $appointment]);

            $em->flush();

            $update = $this->appointmentRepository->find($appointment->getId());

            return [
                'message' => 'Appointment Updated!',
                'code' => 200,
                'data' => $update
            ];
        } catch (Exception $e) {
            return [
                'error' => 'Update Fail',
                'code' => 500,
            ];
        }
    }

    public function deleteAppointment($appointment): array
    {
        try {
            $em = $this->doctrine->getManager();
            $em->remove($appointment);
            $em->flush();

            return [
                'message' => 'Appointment Deleted!',
                'code' => 200,
                'data' => $appointment->getId()
            ];
        } catch (Exception $e) {
            return [
                'error' => 'Delete Fail',
                'code' => 500,
            ];
        }
    }

}