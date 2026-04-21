@Data
public class BatchRequest {
    private Long courseId;
    private String venueType;
    private Integer studentCount;
    private List<LocalDate> preferredDates;
}