package com.porikroma.service;

import com.porikroma.dto.ExpenseDto;
import com.porikroma.dto.ExpenseSettlementDto;
import com.porikroma.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private TripService tripService;

    public List<ExpenseDto> getUserExpenses(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<ExpenseDto> getTripExpenses(Long tripId) {
        return expenseRepository.findByTripId(tripId);
    }

    public ExpenseDto getExpenseById(Long expenseId) {
        return expenseRepository.findById(expenseId)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        expenseDto.setCreatedAt(LocalDateTime.now());
        expenseDto.setUpdatedAt(LocalDateTime.now());
        
        ExpenseDto savedExpense = expenseRepository.save(expenseDto);
        
        // Create settlements for trip members if expense is shared
        if (expenseDto.isShared()) {
            // This would require getting trip members and calculating splits
            // Implementation depends on business logic
        }
        
        return savedExpense;
    }

    public ExpenseDto updateExpense(Long expenseId, ExpenseDto expenseDto, Long userId) {
        ExpenseDto existingExpense = getExpenseById(expenseId);
        
        if (!existingExpense.getPaidByUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this expense");
        }
        
        expenseDto.setExpenseId(expenseId);
        expenseDto.setUpdatedAt(LocalDateTime.now());
        
        return expenseRepository.update(expenseDto);
    }

    public void deleteExpense(Long expenseId, Long userId) {
        ExpenseDto expense = getExpenseById(expenseId);
        
        if (!expense.getPaidByUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this expense");
        }
        
        expenseRepository.deleteById(expenseId);
    }

    public ExpenseSettlementDto updateSettlement(Long expenseId, Long userId, 
                                                ExpenseSettlementDto settlementDto, Long requesterId) {
        // Verify requester has permission to update settlements
        
        
        settlementDto.setExpenseId(expenseId);
        settlementDto.setUserId(userId);
        settlementDto.setUpdatedAt(LocalDateTime.now());
        
        return expenseRepository.updateSettlement(settlementDto);
    }

    public ExpenseSettlementDto updateSettlement(Long settlementId, ExpenseSettlementDto settlementDto) {
        settlementDto.setSettlementId(settlementId);
        settlementDto.setUpdatedAt(LocalDateTime.now());
        return expenseRepository.updateSettlement(settlementDto);
    }

    public Object getTripExpenseSummary(Long tripId) {
        return expenseRepository.getTripExpenseSummary(tripId);
    }

    public boolean isUserTripMember(Long tripId, Long userId) {
        return tripService.isUserTripMember(tripId, userId);
    }

    public boolean canUserUpdateSettlement(Long settlementId, Long userId) {
        Optional<ExpenseSettlementDto> settlement = expenseRepository.findSettlementById(settlementId);
        if (settlement.isEmpty()) {
            return false;
        }
        
        // User can only update their own settlement record
        return settlement.get().getUserId().equals(userId);
    }

    public ExpenseSettlementDto createSettlement(Long expenseId, ExpenseSettlementDto settlementData, Long userId) {
        settlementData.setExpenseId(expenseId);
        settlementData.setCreatedAt(LocalDateTime.now());
        settlementData.setUpdatedAt(LocalDateTime.now());
        return expenseRepository.updateSettlement(settlementData);
    }

    public List<ExpenseSettlementDto> getExpenseSettlements(Long expenseId) {
        return expenseRepository.findSettlementsByExpenseId(expenseId);
    }

    public void markSettlementPaid(Long settlementId) {
        Optional<ExpenseSettlementDto> settlement = expenseRepository.findSettlementById(settlementId);
        if (settlement.isPresent()) {
            ExpenseSettlementDto settlementDto = settlement.get();
            settlementDto.setChecked(true);
            settlementDto.setUpdatedAt(LocalDateTime.now());
            expenseRepository.updateSettlement(settlementDto);
        }
    }
}