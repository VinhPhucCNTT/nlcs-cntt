using FluentValidation;

namespace Backend.Features.Courses;

public class UpdateCourseValidator : AbstractValidator<UpdateCourseDto>
{
    public UpdateCourseValidator()
    {
        RuleFor(c => c.Title)
            .NotEmpty()
            .MaximumLength(100)
            .MinimumLength(5)
            .WithMessage("Title too short or too long.");

        RuleFor(c => c.Description)
            .MaximumLength(1000)
            .WithMessage("Description is too long.");

        RuleFor(c => c.ThumbnailUrl)
            .MaximumLength(500)
            .Must(BeAValidImageUrl)
            .When(c => !string.IsNullOrEmpty(c.ThumbnailUrl))
            .WithMessage("ThumbnailUrl must be a valid URL.");
    }

    private static bool BeAValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    private bool BeAValidImageUrl(string url)
    {
        if (!BeAValidUrl(url)) return false;

        return url.EndsWith(".jpg") ||
               url.EndsWith(".jpeg") ||
               url.EndsWith(".png") ||
               url.EndsWith(".webp");
    }
}
