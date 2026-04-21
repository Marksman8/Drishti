@RestController
@RequestMapping("/api/slots")
public class CourseSlotController {

    @Autowired
    private SlotRepository slotRepository;

    @PostMapping("/book/{slotId}")
    public ResponseEntity<?> bookSlot(@PathVariable Long slotId, @AuthenticationPrincipal Jwt jwt) {
        // Get user ID from the Supabase JWT
        UUID userId = UUID.fromString(jwt.getSubject());

        return slotRepository.findById(slotId).map(slot -> {
            if (slot.getIsBooked()) return ResponseEntity.badRequest().body("Slot already taken");

            slot.setIsBooked(true);
            slot.setBookedBy(userId);
            slotRepository.save(slot);
            return ResponseEntity.ok("Booking confirmed!");
        }).orElse(ResponseEntity.notFound().build());
    }
}