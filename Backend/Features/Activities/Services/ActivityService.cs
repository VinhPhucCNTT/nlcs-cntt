using Backend.Data.Repositories;
using Backend.Data.UnitOfWork;
using Backend.Features.Activities;
using Backend.Features.Activities.Dtos;
using Backend.Models.Courses;

namespace Backend.Features.Activities.Services;

public class ActivityService(
    IActivityRepository activityRepo,
    IUnitOfWork uow) : IActivityService
{
    private readonly IActivityRepository _activityRepo = activityRepo;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Guid> CreateAsync(
        Guid moduleId,
        CreateActivityDto dto)
    {
        var activity = new CourseActivity
        {
            ModuleId = moduleId,
            Title = dto.Title,
            Type = dto.Type,
            OrderIndex = dto.OrderIndex,
            IsPublished = dto.IsPublished,
            AvailableFrom = dto.AvailableFrom,
            AvailableUntil = dto.AvailableUntil
        };

        _activityRepo.Add(activity);

        await _uow.SaveChangesAsync();

        return activity.Id;
    }

    public async Task<List<ViewActivityDto>> GetByModuleAsync(Guid moduleId)
    {
        var activities = await _activityRepo.GetByModuleIdAsync(moduleId);

        return activities.Select(x =>
            new ViewActivityDto(
                x.Id,
                x.Title,
                x.Type,
                x.OrderIndex,
                x.AvailableFrom,
                x.AvailableUntil,
                x.GetResourceId()
            )).ToList();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var activity = await _activityRepo.GetByIdAsync(id);
        if (activity is null)
            return false;

        _activityRepo.Remove(activity);

        await _uow.SaveChangesAsync();
        return true;
    }
}

