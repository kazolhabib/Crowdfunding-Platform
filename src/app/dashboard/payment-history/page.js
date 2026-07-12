"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Spinner, Pagination } from "@heroui/react";
import { Table } from "@heroui/react";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/supporter/payments/history?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Fetch payments error:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchPayments();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchPayments]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Payment History
        </h1>
        <p className="text-zinc-500 text-xs mt-1">Audit log of all your credit purchase transactions.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Spinner size="lg" color="primary" label="Loading payment history..." />
        </div>
      ) : payments.length === 0 ? (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-8 text-center text-sm text-zinc-500">
            No payment history yet. Purchase credits to see transactions here.
          </Card.Content>
        </Card>
      ) : (
        <>
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <Table aria-label="Payment history" variant="default">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Date</Table.Column>
                    <Table.Column>Transaction ID</Table.Column>
                    <Table.Column>Amount (USD)</Table.Column>
                    <Table.Column>Credits Received</Table.Column>
                  </Table.Header>
                  <Table.Body items={payments}>
                    {(item) => (
                      <Table.Row key={item._id}>
                        <Table.Cell className="text-zinc-500 text-xs">
                          {new Date(item.date).toLocaleString()}
                        </Table.Cell>
                        <Table.Cell className="font-mono text-xs max-w-[180px] truncate">
                          {item.stripe_session_id}
                        </Table.Cell>
                        <Table.Cell className="font-semibold">${item.amount_usd}</Table.Cell>
                        <Table.Cell className="font-bold text-indigo-600 dark:text-indigo-400">
                          +{item.credits_purchased} Cr
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
