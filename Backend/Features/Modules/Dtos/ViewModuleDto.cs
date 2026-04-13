namespace Backend.Features.Modules.Dtos;

public record ViewModuleDto(
    Guid Id,
    string Title,
    int OrderIndex,
    int ActivityCount
);
