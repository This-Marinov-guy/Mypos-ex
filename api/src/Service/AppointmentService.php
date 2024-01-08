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
        try {
            $filters = array_combine(
                ['dateFrom', 'dateTo', 'name', 'egn', 'details'],
                array_map(fn($param) => $request->query->get($param), ['dateFrom', 'dateTo', 'name', 'egn', 'details'])
            );

            $page = $request->query->get('page') ?: 1;

            $queryBuilder = $this->appointmentRepository->applyFilters($filters);

            ['paginator' => $paginator, 'pagesCount' => $pagesCount] = $this->appointmentRepository->paginateQuery($queryBuilder, $page);

            $appointments = $paginator->getIterator();

            return [
                'message' => 'success',
                'code' => 200,
                'data' => $appointments,
                'pagesCount' => $pagesCount,
            ];
        } catch (Exception $e) {
            return [
                'message' => 'fail',
                'code' => 500,

            ];
        }
    }

    public function filterName($appointment): array
    {
        try {
            $appointments = $this->appointmentRepository->findBy(['name' => $appointment->getName()], ['date' => 'ASC']);

            return [
                'message' => 'success',
                'code' => 200,
                'data' => array_values(array_filter($appointments, function ($a) use ($appointment) {
                    return $a->getId() !== $appointment->getId() && $a->getDate() > new DateTime();
                }))
            ];
        } catch (Exception $e) {
            return [
                'message' => 'fail',
                'code' => 500,
            ];
        }
    }

    public function createAppointment($request): array
    {
        try {
            $appointment = $this->serializer->deserialize($request->getContent(), Appointment::class, 'json');

            $em = $this->doctrine->getManager();
            $em->persist($appointment);
            $em->flush();

            return [
                'message' => 'Appointment Added!',
                'code' => 200,
                'data' => $appointment
            ];
        } catch (Exception $e) {
            return [
                'message' => 'Creating Fail',
                'code' => 500,

            ];
        }
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
                'message' => 'Update Fail',
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
                'message' => 'Delete Fail',
                'code' => 500,
            ];
        }
    }

}