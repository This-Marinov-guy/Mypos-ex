<?php

namespace App\Repository;

use App\Entity\Appointment;
use Doctrine\Persistence\ManagerRegistry;

/**
 *
 * @method Appointment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Appointment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Appointment[]    findAll()
 * @method Appointment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppointmentRepository extends AbstractRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointment::class);
    }

    public function applyFilters($basicUserName, $filters): object
    {
        $queryBuilder = $this->createQueryBuilder('a')->addSelect('a.id', 'r.id as roomId', 'a.date', 'u.name as name', 'u.egn as egn', 'a.details',)->leftJoin('a.room', 'r')->leftJoin('a.user', 'u')->orderBy('a.date', 'ASC');

        if ($basicUserName) {
            $queryBuilder
                ->andWhere('u.name = :userName')
                ->setParameter('userName', $basicUserName);
        }

        if (isset($filters['dateFrom']) && $filters['dateFrom']) {
            $queryBuilder
                ->andWhere('a.date >= :dateFrom')
                ->setParameter('dateFrom', $filters['dateFrom']);
        }

        if (isset($filters['dateFrom']) && $filters['dateFrom']) {
            $queryBuilder
                ->andWhere('a.date >= :dateFrom')
                ->setParameter('dateFrom', $filters['dateFrom']);
        }

        if (isset($filters['dateTo']) && $filters['dateTo']) {
            $queryBuilder
                ->andWhere('a.date <= :dateTo')
                ->setParameter('dateTo', $filters['dateTo']);
        }

        if (isset($filters['name']) && $filters['name']) {
            $queryBuilder
                ->andWhere('LOWER(u.name) LIKE :name')
                ->setParameter('name', '%' . strtolower($filters['name']) . '%');
        }

        if (isset($filters['egn']) && $filters['egn']) {
            $queryBuilder
                ->andWhere('LOWER(u.egn) LIKE :egn')
                ->setParameter('egn', '%' . strtolower($filters['egn']) . '%');
        }

        if (isset($filters['details']) && $filters['details']) {
            $queryBuilder
                ->andWhere('LOWER(a.details) LIKE :details')
                ->setParameter('details', '%' . strtolower($filters['details']) . '%');
        }

        if (isset($filters['room']) && $filters['room']) {
            $queryBuilder
                ->andWhere('a.room = :room')
                ->setParameter('room', $filters['room']);
        }
        return $queryBuilder;
    }

//    /**
//     * @return Appointment[] Returns an array of Appointment objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Appointment
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
