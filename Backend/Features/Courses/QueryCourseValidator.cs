using FluentValidation;

namespace Backend.Features.Courses;

public class QueryCourseValidator : AbstractValidator<QueryCoursesRequest>
{
    public QueryCourseValidator()
    {
        RuleFor(q => q.Title)
            .NotEmpty()
            .MaximumLength(100)
            .MinimumLength(5)
            .When(q => q.Title is not null)
            .WithMessage("Invalid title.");

        RuleFor(q => q.InstructorName)
            .NotEmpty()
            .MaximumLength(100)
            .MinimumLength(5)
            .When(q => q.InstructorName is not null)
            .WithMessage("Invalid instructor name.");


        RuleFor(q => q.PageIndex)
            .GreaterThan(0)
            .WithMessage("Invalid page index.");

        RuleFor(q => q.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("Invalid page size.");
    }
}
