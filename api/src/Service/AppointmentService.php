<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class AppointmentService
{
    public function __construct(private AppointmentRepository $appointmentRepository, private ManagerRegistry $doctrine, private SerializerInterface $serializer)
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

    public function createAppointment($request): array
    {
        $appointment = $this->serializer->deserialize($request->getContent(), Appointment::class, 'json');

        if (!$appointment) {
            return [
                'error' => 'Failed to add',
                'code' => 500,
            ];
        }

        $em = $this->doctrine->getManager();
        $em->persist($appointment);
        $em->flush();

        return [
            'message' => 'Appointment Added!',
            'code' => 200,
            'data' => $appointment
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