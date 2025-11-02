package com.porikroma.repository;

import com.porikroma.dto.ExpenseDto;
import com.porikroma.dto.ExpenseSettlementDto;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository {
    List<ExpenseDto> findByUserId(Long userId);
    List<ExpenseDto> findByTripId(Long tripId);
    Optional<ExpenseDto> findById(Long expenseId);
    ExpenseDto save(ExpenseDto expenseDto);
    ExpenseDto update(ExpenseDto expenseDto);
    void deleteById(Long expenseId);
    List<ExpenseSettlementDto> findSettlementsByExpenseId(Long expenseId);
    ExpenseSettlementDto updateSettlement(ExpenseSettlementDto settlementDto);
    void createSettlementsForExpense(Long expenseId, List<Long> memberIds, java.math.BigDecimal amountPerPerson);
    Object getTripExpenseSummary(Long tripId);
    Optional<ExpenseSettlementDto> findSettlementById(Long settlementId);
}