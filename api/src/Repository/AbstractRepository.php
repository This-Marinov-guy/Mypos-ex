<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;

abstract class AbstractRepository extends ServiceEntityRepository
{
    public function paginateQuery($queryBuilder, $page, $limit = 4): array
    {
        $paginator = new Paginator($queryBuilder);

        $paginator
            ->getQuery()
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        $totalItems = count($paginator);

        $pagesCount = ceil($totalItems / $limit);

        return [
            'paginator' => $paginator,
            'pagesCount' => $pagesCount,
        ];
    }
}