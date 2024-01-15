<?php

namespace App\Service;

use App\Constants\Filters;
use App\Constants\Roles;
use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class AppointmentService
{
	public function __construct(
		private AppointmentRepository $appointmentRepository,
		private RoomService           $roomService,
		private UserService           $userService,
		private AuthorizeService      $authService,
		private UserRepository        $userRepository,
		private ManagerRegistry       $doctrine,
		private SerializerInterface   $serializer
	) {
	}

	public function filterPaginated(Request $request, $roomId = null): array
	{

		$filters = array_combine(
			Filters::APPOINTMENT,
			array_map(fn($param) => $request->query->get($param), Filters::APPOINTMENT)
		);

		if ($roomId) {
			$filters['room'] = (string)$roomId;
		}

		$page = $request->query->get('page') ?: 1;

		$user = $this->userService->getUserFromJWTToken($request);

		//check if user is admin and if not return their name in order to limit the appointments to their own
		$basicUserName = !array_diff(Roles::ADMIN, $user->getRoles()) ? null : $user->getName();

		$queryBuilder = $this->appointmentRepository->applyFilters($basicUserName, $filters);

		['paginator' => $paginator, 'pagesCount' => $pagesCount] = $this->appointmentRepository->paginateQuery(
			$queryBuilder,
			$page
		);

		$appointments = $paginator->getIterator();

		if (!$appointments) {
			return [
				'message' => 'Failed to fetch',
				'code'    => 500,
			];
		}

		return [
			'message'    => 'success',
			'code'       => 200,
			'data'       => $appointments,
			'pagesCount' => $pagesCount,
		];
	}

	public function extendAppointment($appointment): array
	{
		return [
			'id'      => $appointment->getId(),
			'userId'  => $appointment->getUser()->getId(),
			'date'    => $appointment->getDate(),
			'details' => $appointment->getDetails(),
			'roomId'  => $appointment->getRoom()->getId(),
			'name'    => $appointment->getUser()->getName(),
			'egn'     => $appointment->getUser()->getEgn(),
		];
	}

	public function filterName($userId, $appointmentId): array
	{
		$appointments = $this->appointmentRepository->nameFilterQuery($userId, $appointmentId)->execute();

		return [
			'message' => 'success',
			'code'    => 200,
			'data'    => $appointments,
		];
	}


	public function createAppointment($request): array
	{
		$appointment = $this->serializer->deserialize($request->getContent(), Appointment::class, 'json');

		$user = $this->userService->getUserFromJWTToken($request);

		if (!$appointment) {
			return [
				'message' => 'Failed to add',
				'code'    => 500,
			];
		}

		$targetRoom = $this->roomService->availableRoom();

		if (!$targetRoom) {
			return [
				'message' => 'All rooms are full',
				'code'    => 500,
			];
		}

		$errors = $this->appointmentRepository->validate($appointment);
		if (
			$errors
		) {
			return [
				'message' => $errors,
				'code'    => 422,
			];
		}

		$appointment->setRoom($targetRoom);
		$appointment->setUser($user);

		$em = $this->doctrine->getManager();
		$em->persist($targetRoom);
		$em->persist($appointment);
		$em->persist($user);
		$em->flush();

		return [
			'message' => 'Appointment Added!',
			'code'    => 200,
			'data'    => ['groups' => 'appointment', 'user', 'room'],
		];

	}

	public function updateAppointment($appointment, $request): array
	{
		$errors = $this->appointmentRepository->validate($appointment);
		if (
			$errors
		) {
			return [
				'message' => $errors,
				'code'    => 422,
			];
		}

		$authorization = $this->authService->authorizeUserAppointmentActions($request, $appointment);

		if (!$authorization['access']) {
			return [
				'message' => $authorization['error'],
				'code'    => $authorization['code'],
			];
		}

		$em = $this->doctrine->getManager();

		$this->serializer->deserialize(
			$request->getContent(),
			Appointment::class,
			'json',
			['object_to_populate' => $appointment]
		);

		$em->flush();

		$update = $this->appointmentRepository->find($appointment->getId());

		return [
			'message' => 'Appointment Updated!',
			'code'    => 200,
			'data'    => $update,
		];

	}

	public function deleteAppointment($request, $appointment): array
	{
		$authorization = $this->authService->authorizeUserAppointmentActions($request, $appointment);

		if (!$authorization['access']) {
			return [
				'message' => $authorization['error'],
				'code'    => $authorization['code'],
			];
		}

		$em = $this->doctrine->getManager();
		$em->remove($appointment);
		$em->flush();

		return [
			'message' => 'Appointment Deleted!',
			'code'    => 200,
			'data'    => $appointment->getId(),
		];

	}

}