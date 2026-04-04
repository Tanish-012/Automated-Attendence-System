package com.attendance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String admissionNumber;

    @Column(nullable = false)
    private String grade; // e.g., "10", "12A"

    @Column(unique = true)
    private String qrCodeId; // Unique ID embedded in the QR Code

    // For the Academic Performance Tracker feature
    @Column
    private Double averageGrade;

    // Contact info for the Parent Communication Portal feature
    @Column
    private String parentPhoneNumber;
}
