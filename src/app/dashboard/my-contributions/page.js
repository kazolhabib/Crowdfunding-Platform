"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Chip, Spinner, Pagination } from "@heroui/react";
import { Table } from "@heroui/react";

const STATUS_COLORS = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export default function MyContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/supporter/contributions?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setContributions(data.contributions);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Fetch contributions error:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchContributions();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchContributions]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          My Contributions
        </h1>
        <p className="text-zinc-500 text-xs mt-1">Track the campaigns you have supported.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Spinner size="lg" color="primary" label="Loading contributions..." />
        </div>
      ) : contributions.length === 0 ? (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-8 text-center text-sm text-zinc-500">
            You have not made any contributions yet. Explore campaigns to get started!
          </Card.Content>
        </Card>
      ) : (
        <>
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <Table aria-label="My contributions" variant="default">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Campaign</Table.Column>
                    <Table.Column>Creator</Table.Column>
                    <Table.Column>Amount</Table.Column>
                    <Table.Column>Date</Table.Column>
                    <Table.Column>Status</Table.Column>
                  </Table.Header>
                  <Table.Body items={contributions}>
                    {(item) => (
                      <Table.Row key={item._id}>
                        <Table.Cell className="font-semibold max-w-[200px] truncate">
                          {item.campaign_title}
                        </Table.Cell>
                        <Table.Cell>{item.creator_name}</Table.Cell>
                        <Table.Cell className="font-bold text-indigo-600 dark:text-indigo-400">
                          {item.contribution_amount} Cr
                        </Table.Cell>
                        <Table.Cell className="text-zinc-500 text-xs">
                          {new Date(item.date).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={STATUS_COLORS[item.status] || "default"}
                            className="capitalize font-semibold"
                          >
                            {item.status}
                          </Chip>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      onPress={() => setPage((p) => Math.max(1, p - 1))}
                      isDisabled={page <= 1}
                    />
                  </Pagination.Item>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Pagination.Item key={p}>
                      <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                        {p}
                      </Pagination.Link>
                    </Pagination.Item>
                  ))}
                  <Pagination.Item>
                    <Pagination.Next
                      onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                      isDisabled={page >= totalPages}
                    />
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
