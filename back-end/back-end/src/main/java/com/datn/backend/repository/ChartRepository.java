package com.datn.backend.repository;

import com.datn.backend.dto.response.DiscountSummaryResponse;
import com.datn.backend.dto.response.ProductsSummaryResponse;
import com.datn.backend.model.hoa_don.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface ChartRepository extends JpaRepository<HoaDon, Integer> {

    @Query(value = """
            SELECT COUNT(hd.trang_thai) FROM hoa_don hd
            WHERE hd.trang_thai = 'HOAN_THANH';
            """, nativeQuery = true)
    Long countInvoiceComplete();

    @Query(value = """
            SELECT COUNT(hd.trang_thai) FROM hoa_don hd
            WHERE hd.trang_thai = 'CHO_XAC_NHAN';
            """, nativeQuery = true)
    Long countInvoiceWFC();

    @Query(value = """
            SELECT COUNT(hd.trang_thai) FROM hoa_don hd
            WHERE hd.trang_thai = 'CHO_GIAO';
            """, nativeQuery = true)
    Long countInvoiceWFD();

    @Query(value = """
                SELECT COALESCE(SUM(CASE WHEN hd.trang_thai = 'HOAN_THANH' THEN 1 ELSE 0 END), 0) AS SoLuongDonHoanThanh
            FROM (
                SELECT 1 AS Thang UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
                SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
                SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL
                SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
            ) AS thang
            LEFT JOIN hoa_don hd ON thang.Thang = MONTH(hd.created_at)
            AND YEAR(hd.created_at) = YEAR(CURDATE()) AND hd.trang_thai = 'HOAN_THANH'
            GROUP BY thang.Thang
            ORDER BY thang.Thang;
                """, nativeQuery = true)
    List<Long> countInvoiceInThisYear();

    @Query(value = """
                SELECT COALESCE(SUM(CASE WHEN hd.trang_thai = 'HOAN_THANH' THEN 1 ELSE 0 END), 0) AS SoLuongDonHoanThanh
            FROM (
                SELECT 1 AS Thang UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
                SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
                SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL
                SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
            ) AS thang
            LEFT JOIN hoa_don hd ON thang.Thang = MONTH(hd.created_at)
            AND YEAR(hd.created_at) = YEAR(CURDATE()) - 1 AND hd.trang_thai = 'HOAN_THANH'
            GROUP BY thang.Thang
            ORDER BY thang.Thang;
                """, nativeQuery = true)
    List<Long> countInvoiceInLastYear();


    @Query(value = """
                     SELECT COUNT(*) AS total_orders
                     FROM hoa_don
                     WHERE trang_thai = 'HOAN_THANH'
                         AND created_at >= :startDate
                         AND created_at <= DATE_ADD( :startDate , INTERVAL CEIL( :totalDays / 4) DAY)
                     UNION ALL
                     SELECT  COUNT(*) AS total_orders
                     FROM hoa_don
                     WHERE trang_thai = 'HOAN_THANH'
                         AND created_at > DATE_ADD(:startDate, INTERVAL CEIL(:totalDays / 4) DAY)\s
                         AND created_at <= DATE_ADD(:startDate, INTERVAL CEIL(:totalDays / 2) DAY)
                     UNION ALL
                     SELECT COUNT(*) AS total_orders
                     FROM hoa_don
                     WHERE trang_thai = 'HOAN_THANH'
                     	AND created_at > DATE_ADD(:startDate, INTERVAL CEIL(:totalDays / 2) DAY)\s
                         AND created_at <= DATE_ADD(:startDate, INTERVAL CEIL(:totalDays * 3 / 4) DAY)
                     UNION ALL
                     SELECT COUNT(*) AS total_orders
                     FROM hoa_don
                     WHERE trang_thai = 'HOAN_THANH'
                         AND created_at > DATE_ADD(:startDate, INTERVAL CEIL(:totalDays * 3 / 4) DAY)\s
                         AND created_at <= :endDate ;
            """,
            nativeQuery = true)
    List<Long> countInvoice4WeekInMonth(@Param("startDate") LocalDate startDate
            , @Param("endDate") LocalDate endDate, @Param("totalDays") int totalDays);


    @Query(value = """

                        SELECT IFNULL(COUNT(*), 0) as SoDon
            FROM hoa_don
            WHERE DAY(created_at) = DAY(LAST_DAY( :today ));
            """, nativeQuery = true)
    Long countInvoiceLastDayOfMonth(@Param("today") LocalDate today);

    @Query(value = """
            SELECT COALESCE(COUNT(hd.trang_thai), 0) AS SoDonHang
            FROM (
                SELECT 0 AS num UNION ALL
                SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                SELECT 5 UNION ALL SELECT 6
            ) AS numbers
            LEFT JOIN hoa_don hd ON DATE(hd.created_at) = DATE_ADD( :startOfWeek , INTERVAL num DAY)
                                  AND hd.trang_thai = 'HOAN_THANH'
            GROUP BY DATE_ADD( :startOfWeek , INTERVAL num DAY)
            ORDER BY DATE_ADD( :startOfWeek , INTERVAL num DAY);
                        """, nativeQuery = true)
    List<Long> countInvoice7DayThisWeek(@Param("startOfWeek") Date startOfWeek);

    @Query(value = """             
            SELECT COALESCE(COUNT(hd.trang_thai), 0) AS SoDonHang
                        FROM (
                            SELECT 0 AS num UNION ALL
                            SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                            SELECT 5 UNION ALL SELECT 6
                        ) AS numbers
                        LEFT JOIN hoa_don hd ON DATE(hd.created_at) = DATE_ADD( :startOfLastWeek , INTERVAL num DAY)
                                              AND hd.trang_thai = 'HOAN_THANH'
                        GROUP BY DATE_ADD( :startOfLastWeek, INTERVAL num DAY)
                        ORDER BY DATE_ADD( :startOfLastWeek , INTERVAL num DAY);
                             """, nativeQuery = true)
    List<Long> countInvoice7DayLastWeek(@Param("startOfLastWeek") Date startOfLastWeek);

    @Query(value = """
             SELECT
             COALESCE(COUNT(kh.id), 0) AS so_tai_khoan_tao
             FROM
             (SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
             SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) AS months
             LEFT JOIN
             khach_hang kh ON MONTH(kh.created_at) = months.month
             AND YEAR(kh.created_at) = YEAR(CURDATE())
             GROUP BY
            months.month;
                 """, nativeQuery = true)
    List<Long> countCustomerInThisYear();

    @Query(value = """
             SELECT
             COALESCE(COUNT(kh.id), 0) AS total_customer
             FROM
             (SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
             SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) AS months
             LEFT JOIN
             khach_hang kh ON MONTH(kh.created_at) = months.month
             AND YEAR(kh.created_at) = YEAR(CURDATE())-1
             GROUP BY
            months.month;
                 """, nativeQuery = true)
    List<Long> countCustomerInLastYear();

    @Query(value = """
                     SELECT COUNT(*) AS total_customer
                     FROM khach_hang
                         WHERE created_at >= :startDate
                         AND created_at <= DATE_ADD( :startDate , INTERVAL CEIL( :totalDays / 4) DAY)
                     UNION ALL
                     SELECT  COUNT(*) AS total_customer
                     FROM khach_hang
                         WHERE created_at > DATE_ADD(:startDate, INTERVAL CEIL(:totalDays / 4) DAY)\s
                         AND created_at <= DATE_ADD(:startDate, INTERVAL CEIL(:totalDays / 2) DAY)
                     UNION ALL
                     SELECT COUNT(*) AS total_customer
                     FROM khach_hang
                     	WHERE created_at > DATE_ADD(:startDate, INTERVAL CEIL(:totalDays / 2) DAY)\s
                         AND created_at <= DATE_ADD(:startDate, INTERVAL CEIL(:totalDays * 3 / 4) DAY)
                     UNION ALL
                     SELECT COUNT(*) AS total_customer
                     FROM khach_hang
                         WHERE created_at > DATE_ADD(:startDate, INTERVAL CEIL(:totalDays * 3 / 4) DAY)\s
                         AND created_at <= :endDate ;
            """,
            nativeQuery = true)
    List<Long> countCustomer4WeekInMonth(@Param("startDate") LocalDate startDate
            , @Param("endDate") LocalDate endDate, @Param("totalDays") int totalDays);

    @Query(value = """
            SELECT IFNULL(COUNT(*), 0) as total_customer
            FROM khach_hang
            WHERE DAY(created_at) = DAY(LAST_DAY( :today ));
            """, nativeQuery = true)
    Long countCustomerLastDayOfMonth(@Param("today") LocalDate today);

    @Query(value = """
            SELECT COALESCE(COUNT(kh.id), 0) AS customer
            FROM (
                SELECT 0 AS num UNION ALL
                SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                SELECT 5 UNION ALL SELECT 6
            ) AS numbers
            LEFT JOIN khach_hang kh ON DATE(kh.created_at) = DATE_ADD( :startOfWeek , INTERVAL num DAY)
            GROUP BY DATE_ADD( :startOfWeek , INTERVAL num DAY)
            ORDER BY DATE_ADD( :startOfWeek , INTERVAL num DAY);
                        """, nativeQuery = true)
    List<Long> countCustomer7DayThisWeek(@Param("startOfWeek") Date startOfWeek);

    @Query(value = """             
            SELECT COALESCE(COUNT(kh.id), 0) AS customer
                        FROM (
                            SELECT 0 AS num UNION ALL
                            SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                            SELECT 5 UNION ALL SELECT 6
                        ) AS numbers
                        LEFT JOIN khach_hang kh ON DATE(kh.created_at) = DATE_ADD( :startOfLastWeek , INTERVAL num DAY)
                        GROUP BY DATE_ADD( :startOfLastWeek, INTERVAL num DAY)
                        ORDER BY DATE_ADD( :startOfLastWeek , INTERVAL num DAY);
                             """, nativeQuery = true)
    List<Long> countCustomer7DayLastWeek(@Param("startOfLastWeek") Date startOfLastWeek);

    @Query(value = """
                        SELECT dgg.ma_dot_giam_gia as MaDotGiamGia, SUM(hdct.so_luong) as TongSanPhamDuocBan
                        FROM dot_giam_gia dgg
                        JOIN dot_giam_gia_san_pham dggsp ON dggsp.dot_giam_gia_id = dgg.id
                        JOIN san_pham_chi_tiet spct ON spct.id = dggsp.san_pham_chi_tiet_id
                        JOIN hoa_don_chi_tiet hdct ON hdct.id_spct = spct.id
                        JOIN hoa_don hd ON hd.id = hdct.id_hoa_don
                        WHERE hd.created_at BETWEEN dggsp.thoi_gian_bat_dau AND dggsp.thoi_gian_ket_thuc
                        AND hd.trang_thai = 'HOAN_THANH'
                        AND YEAR(hd.created_at) = YEAR(CURDATE())\s
                        	AND YEAR(dggsp.thoi_gian_bat_dau) = YEAR(CURDATE())
                            AND YEAR(dggsp.thoi_gian_ket_thuc) = YEAR(CURDATE())
                        GROUP BY MaDotGiamGia;
            """, nativeQuery = true)
    List<DiscountSummaryResponse> getMaDotGiamGiaAndNumberOfProductPurchasedCurrentYear();

    @Query(value = """
                        SELECT dgg.ma_dot_giam_gia as MaDotGiamGia, SUM(hdct.so_luong) as TongSanPhamDuocBan
                        FROM dot_giam_gia dgg
                        JOIN dot_giam_gia_san_pham dggsp ON dggsp.dot_giam_gia_id = dgg.id
                        JOIN san_pham_chi_tiet spct ON spct.id = dggsp.san_pham_chi_tiet_id
                        JOIN hoa_don_chi_tiet hdct ON hdct.id_spct = spct.id
                        JOIN hoa_don hd ON hd.id = hdct.id_hoa_don
                        WHERE hd.created_at BETWEEN dggsp.thoi_gian_bat_dau AND dggsp.thoi_gian_ket_thuc
                        AND hd.trang_thai = 'HOAN_THANH'
                        AND YEAR(hd.created_at) = YEAR( :year )\s
                        	AND YEAR(dggsp.thoi_gian_bat_dau) = YEAR( :year )
                            AND YEAR(dggsp.thoi_gian_ket_thuc) = YEAR( :year )
                        GROUP BY MaDotGiamGia;
            """, nativeQuery = true)
    List<DiscountSummaryResponse> getMaDotGiamGiaAndNumberOfProductPurchasedAnyYear(@Param("year") LocalDate year);

    @Query(value = """
                        SELECT sp.ma as MaSanPham, sp.ten as TenSanPham, SUM(hdct.so_luong) as SoLuongMua
            FROM san_pham sp\s
            JOIN san_pham_chi_tiet spct ON spct.san_pham_id = sp.id
            JOIN hoa_don_chi_tiet hdct ON hdct.id_spct = spct.id
            JOIN hoa_don hd ON hd.id = hdct.id_hoa_don
            WHERE YEAR(hd.created_at) = YEAR(CURDATE())
            GROUP BY MaSanPham,TenSanPham
                        """, nativeQuery = true)
    List<ProductsSummaryResponse> getListProductPurchasedInCurrentYear();

    @Query(value = """
                        SELECT sp.ma as MaSanPham, sp.ten as TenSanPham, SUM(hdct.so_luong) as SoLuongMua
            FROM san_pham sp\s
            JOIN san_pham_chi_tiet spct ON spct.san_pham_id = sp.id
            JOIN hoa_don_chi_tiet hdct ON hdct.id_spct = spct.id
            JOIN hoa_don hd ON hd.id = hdct.id_hoa_don
            WHERE YEAR(hd.created_at) = YEAR( :year )
            GROUP BY MaSanPham,TenSanPham
                        """, nativeQuery = true)
    List<ProductsSummaryResponse> getListProductPurchasedInAnyYear(@Param("year") LocalDate year);
}