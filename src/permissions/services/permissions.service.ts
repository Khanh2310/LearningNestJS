import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { IUser } from 'src/users/types';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from '../schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExits = await this.permissionModel.findOne({
      apiPath,
      method,
    });
    if (isExits) {
      throw new BadRequestException(
        `Permission with apiPath: ${apiPath}, method: ${method} already exits`,
      );
    }
    const newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      id: newPermission?._id,
      createdAt: newPermission?.createdAt,
    };
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: string) {
    return `This action returns a #${id} permission`;
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: string) {
    return `This action removes a #${id} permission`;
  }
}